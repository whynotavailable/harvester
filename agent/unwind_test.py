from unwinder import unwind


def test_basic():
    case = {"name": "john"}

    cols = unwind(case)
    assert len(cols) == 1
    assert cols[0]["name"] == "name"
    assert cols[0]["path"] == "name"
    assert cols[0]["kind"] == "str"


def test_not_so_basic():
    case = {
        "name": "john",
        "age": 43,
        "kids": [{"name": "sally"}, {"name": "david"}],
        "nums": [12, 32, 54],
        "sres": ["hi"],
        "car": {"color": "red"},
    }

    cols = unwind(case)

    dump_cols(cols)


def test_array():
    case = [12, 32, 4]

    cols = unwind(case)

    dump_cols(cols)


def dump_cols(cols):
    print("")
    for col in cols:
        print(f'{col["path"]}: {col["kind"]}')
