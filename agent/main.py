import psycopg2
import psycopg2.extras

conn = psycopg2.connect("dbname=test host=127.0.0.1 user=postgres password=example")
cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

cur.execute(
    "SELECT * FROM information_schema.tables WHERE NOT table_schema = 'pg_catalog' AND NOT table_schema = 'information_schema';"
)


def get_table_data(row):
    return {"schema": row["table_schema"], "name": row["table_name"]}


def get_stuff(data, mapper):
    return list(map(mapper, data))


# map(lambda x: x + x, numbers)
tables = get_stuff(cur.fetchall(), get_table_data)
table = tables[0]

get_column_sql = "SELECT * FROM information_schema.columns WHERE table_schema = %s AND table_name = %s"
cur.execute(get_column_sql, (table["schema"], table["name"]))


def get_column_data(row):
    return {"name": row["column_name"], "type": row["udt_name"]}


columns = get_stuff(cur.fetchall(), get_column_data)
print(columns)
