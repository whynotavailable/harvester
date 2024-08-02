def _unwind_dict(point, path_prefix):
    columns = []
    keys = point.keys()

    for key in keys:
        val = point[key]
        columns += _pick_unwind(key, val, path_prefix)

    return columns


def _unwind_list(point, path_prefix):
    columns = []

    for col in point:
        val_type = type(col).__name__

        if val_type != "dict" and val_type != "list":
            prefix_parts = path_prefix.split(".")
            new_prefix = ""
            if len(prefix_parts) > 1:
                new_prefix = prefix_parts[-2]

            columns.append(
                {
                    "path": f"{path_prefix}[{val_type}]",
                    "name": new_prefix,
                    "kind": "list",
                }
            )
        else:
            columns += _pick_unwind("[]", col, path_prefix)

    return columns


def _pick_unwind(key, val, path_prefix):
    new_prefix = f"{path_prefix}{key}."

    if new_prefix == ".":
        new_prefix = ""

    columns = []

    val_type = type(val).__name__

    if val_type == "dict":
        columns += _unwind_dict(val, new_prefix)
    elif val_type == "list":
        columns += _unwind_list(val, new_prefix)
    else:
        columns.append({"name": key, "path": path_prefix + key, "kind": val_type})

    return columns


def unwind(point, cols=[], path_prefix=""):
    return _pick_unwind("", point, path_prefix)
