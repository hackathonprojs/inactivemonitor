// this query will count the number of tx group by last_tx_time.
// reference: https://stackoverflow.com/questions/23116330/mongodb-select-count-group-by
db.last_tx_time.aggregate([
    {"$group" : {_id:"$last_tx_time", count:{$sum:1}}}
])
