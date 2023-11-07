from concurrent.futures import ThreadPoolExecutor
from threading import *
import pandas as pd
import time
import threading
# Threading:
# - A new thread is spawned within the existing process
# - starting a thread is faster than starting a process
# - memory is shared between all threads
# - mutexes often necessary to control access to shared data
# - on GIL (Global Interpreter Lock) for all threads
# semaphore locks with lock access count
semTrn = Semaphore(4)
semLd = Semaphore(4)


def extract(file):
    dtype_dict = {'FIRST_NAME': 'category',
                  'LAST_NAME': 'category',
                  'AGE': 'category',
                  'CONTACT': 'category',
                  'ADDRESS': 'category',
                  'SALARY': 'category'
                  }

    df = pd.read_csv(file, dtype=dtype_dict, low_memory=False)
    return df


def transform(df):
    # semaphore lock
    semTrn.acquire()
    print("thread {} acquired tranform lock ".format(
        threading.currentThread().ident))
    # basic transformation operation

    df['FIRST_NAME'] = df['FIRST_NAME'].str.lower()
    df['LAST_NAME'] = df['LAST_NAME'].str.lower()
    df['CONTACT'] = '+91'+df['CONTACT'].astype(str)
    semTrn.release()
    print("thread {} released tranform lock ".format(
        threading.currentThread().ident))
    print("thread {} acquired load lock ".format(
        threading.currentThread().ident))
    semLd.acquire()
    load(df)


def load(tdf):

    tdf.to_csv('./export.csv',
               mode='w', header=False, index=False)
    semLd.release()
    print("thread {} released load lock  ".format(
        threading.currentThread().ident))
    print("thread {} load completion ".format(threading.currentThread().ident))


def main():
    print('NOTE: *** Dope if it is not working you forgot to change file path in code***')
    pd.set_option('mode.chained_assignment', None)
    file = './export.csv'
    df = extract(file)
    chunk_size = int(df.shape[0] / 4)
    ##t = [0] * 4
    executor = ThreadPoolExecutor(max_workers=4)
    lst = list()
    for start in range(0, df.shape[0], chunk_size):
        df_subset = df.iloc[start:start + chunk_size]
        # df_subset.is_copy=None
        lst.append(executor.submit(transform, df_subset))
    for future in lst:
        future.result()
    executor.shutdown()


if __name__ == "__main__":
    start = time.time()
    main()
    end = time.time() - start
    print("Execution time {} sec".format(end))