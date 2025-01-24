import os
import json
import pandas as pd

# CREATE TABLE "item"(
#   "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
#   "metadata" TEXT NOT NULL DEFAULT '{}',
#   "iiif_info_url" TEXT NOT NULL,
#   "part_of" INTEGER NOT NULL REFERENCES "collection"("id"),
#   "is_georeferenced" INTEGER NOT NULL DEFAULT '0',
#   "is_validated" INTEGER NOT NULL DEFAULT '0'
# , "canvas_id" TEXT NOT NULL)

df_metadata = pd.read_csv("all-maps.csv")


def main(manifest_folder: str):

    VALUES_STATEMENT = ""

    for manifest_filename in os.listdir(manifest_folder):
        file_path = os.path.join(manifest_folder, manifest_filename)

        with open(file_path) as f:
            manifest = json.load(f)

        canvases = manifest["sequences"][0]["canvases"]

        if len(canvases) == 1:
            # Metadata is about this image
            use_metadata = True
        else:
            # Empty metadata
            use_metadata = False

        for canvas in canvases:
            id = "NULL"
            iiif_info_url = canvas["images"][0]["resource"]["service"]["@id"]
            part_of = 1
            is_georeferenced = 0
            is_validated = 0
            canvas_id = canvas["@id"]
            manifest_id = manifest["@id"]

            if use_metadata:

                for label in manifest["metadata"]:
                    if label["label"] == "Persistent Identifier":
                        handle = label["value"]

                        title, date = df_metadata.loc[
                            df_metadata["uri"] == handle, ["title", "year"]
                        ].values[0]

                metadata = json.dumps({"title": title, "date": date}).replace("'", "''")
            else:
                metadata = "{}"

            VALUES_STATEMENT += f"('{metadata}', '{iiif_info_url}', {part_of}, {is_georeferenced}, {is_validated}, '{canvas_id}', '{manifest_id}'),\n"

    sql_insert = f"""
    INSERT INTO item (metadata, iiif_info_url, part_of, is_georeferenced, is_validated, canvas_id, manifest_id)
    VALUES {VALUES_STATEMENT[:-2]};
    
    """

    with open("insert.sql", "w") as f:
        f.write(sql_insert)


if __name__ == "__main__":
    manifest_folder = "manifests"

    main(manifest_folder)
