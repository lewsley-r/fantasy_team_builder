import json
import os
from typing import Counter


script_dir = os.path.dirname(__file__)
file_path = os.path.join(script_dir, 'dataset.json')
with open(file_path, 'r') as fi:
    data = json.load(fi)
    counter = 0
    # print(data[0].keys()) //Used to Extract Keys List for Angular App
    for i in data:
        for j in list(i):
            i[j.replace(" ", "_")] = i.pop(j) #Replacing spaces in keys for underscores
            # if i[j] == None: //Replaces all nulls with 0, as null display blanks in Angular app
            #     i.update( {j : 0} )
            #     print(i[j])
            

    fi.close()

with open(file_path, 'w') as fi:
    json.dump(data, fi) #Writing new key format to file