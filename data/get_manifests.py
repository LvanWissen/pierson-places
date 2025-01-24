import os
import json
import requests
import pandas as pd


def download_manifest(identifier: str):
    manifest_url = f"https://uvaerfgoed.nl/viewer/api/v1/records/{identifier}/manifest/"

    response = requests.get(manifest_url)
    response.raise_for_status()

    data = response.json()

    return data


def main(maps_csv_path: str):
    df = pd.read_csv(maps_csv_path)

    for index, row in df.iterrows():
        identifier = (
            row["uri"]
            .replace("https://hdl.handle.net/11245/", "11245_")
            .replace(".", "_")
        )

        if f"{identifier}.json" in os.listdir("manifests"):
            print(f"{index}\tSkipping {identifier}")
            continue

        print(f"{index}\tDownloading manifest for {identifier}")
        data = download_manifest(identifier)

        with open(f"manifests/{identifier}.json", "w") as f:
            f.write(json.dumps(data, indent=2))


if __name__ == "__main__":
    main("all-maps.csv")
