import pandas as pd
dtype_dict = {
                  'FIRST_NAME': 'category',
                  'LAST_NAME': 'category',
                  'AGE': 'category',
                  'CONTACT': 'category',
                  'ADDRESS': 'category',
                  'SALARY': 'category'
            }
df = pd.read_csv("./ETL.csv",dtype=dtype_dict, low_memory=False)

print(df.columns.tolist())

df['FIRST_NAME'] = df['FIRST_NAME'].str.lower()
df['LAST_NAME'] = df['LAST_NAME'].str.lower()
df['CONTACT'] = '+91'+df['CONTACT'].astype(str)
df.to_csv('file1.csv', index=False)