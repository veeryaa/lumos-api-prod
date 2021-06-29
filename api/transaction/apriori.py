#!/usr/bin/env python
# coding: utf-8

import sys

import numpy as np
import matplotlib.pyplot as plt
import pandas as pd


from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import apriori, fpmax, fpgrowth
from mlxtend.frequent_patterns import association_rules


df = pd.read_csv('/home/fadelfirmansyah/Documents/Lumos Final Project/lumos-api-ts/api/transaction/lumos.csv', header=None, dtype=None)


df = df.replace(np.nan, '')

total_data = int(sys.argv[3])

records = []
for i in range(0, total_data):
    records.append([str(df.values[i,j]) for j in range(0, 7)])

records = list(filter(None,[list(filter(None,l)) for l in records]))

te = TransactionEncoder()

te_ary = te.fit(records).transform(records)

frame = pd.DataFrame(te_ary, columns=te.columns_)

minx = float(sys.argv[1])
conf = float(sys.argv[2])

item = apriori(frame, min_support=minx, use_colnames=True)
print(association_rules(item, metric="confidence", min_threshold=conf).to_string())