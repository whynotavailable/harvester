import psycopg2
import psycopg2.extras
import psycopg2.sql as sql
import unwinder

conn = psycopg2.connect("dbname=test host=127.0.0.1 user=postgres password=example")
cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
psycopg2.extras.register_hstore(cur)

cur.execute(
    "SELECT * FROM information_schema.tables WHERE NOT table_schema = 'pg_catalog' AND NOT table_schema = 'information_schema';"
)


def get_table_data(row):
    return {"schema": row["table_schema"], "name": row["table_name"]}


def get_stuff(data, mapper):
    return list(map(mapper, data))


def is_column_unstructured(column):
    if column["type"] == "hstore":
        return True
    else:
        return False


# map(lambda x: x + x, numbers)
tables = get_stuff(cur.fetchall(), get_table_data)
for table in tables:
    get_column_sql = "SELECT * FROM information_schema.columns WHERE table_schema = %s AND table_name = %s"
    cur.execute(get_column_sql, (table["schema"], table["name"]))

    def get_column_data(row):
        return {"name": row["column_name"], "type": row["udt_name"]}

    columns = get_stuff(cur.fetchall(), get_column_data)

    unstructured_columns = list(filter(is_column_unstructured, columns))

    # TODO: make this more filtered down for only the unstructured_columns
    get_sample_sql = sql.SQL("SELECT * FROM {schema}.{table} LIMIT 100").format(
        schema=sql.Identifier(table["schema"]), table=sql.Identifier(table["name"])
    )

    cur.execute(get_sample_sql)

    sample_data = cur.fetchall()

    virtual_columns = []

    for column in unstructured_columns:
        column_name = column["name"]
        points = filter(lambda row: column_name in row, sample_data)
        points = map(lambda row: row[column_name], points)
        points = list(points)

        for point in points:
            cols = unwinder.unwind(point)
            virtual_columns += cols

    if len(virtual_columns) > 0:
        print(virtual_columns)
