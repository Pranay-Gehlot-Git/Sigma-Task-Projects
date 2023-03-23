const { MongoClient } = require('mongodb');
const { createLogger } = require('logger');


const Log = createLogger('migration.log');
const url = 'mongodb+srv://pranay-gehlotlf:pranaygehlot@cluster0.grtlhyj.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'test';

const Mycollection = 'c_expenses';

const client = new MongoClient(url);
try {

    client.connect()
    Log.info("Database Connected");
} catch (err) {
    Log.info("Database Not Connected", err);
    return
}

let currRecord = 0;
let failRecords = 0;
async function addF() {
    const db = client.db(dbName);
    const collection = db.collection(Mycollection);
    const totaldocs = await collection.countDocuments()




    const check = await collection.aggregate([

        {
            $group: {
                _id: null,
                temp: { $push: "$$ROOT" }
            }
        },

        {
            $project: {
                _id: 0,
                temp_field: {
                    $reduce: {
                        input: "$temp",
                        initialValue: {
                            type: "",
                            balance: 0,
                            results: [],
                        },
                        in: {
                            balance: { $add: ["$$this.amount", "$$value.balance"] },
                            results: {
                                $concatArrays: [
                                    "$$value.results",
                                    [
                                        {
                                            _id: "$$this._id",
                                            balance: {
                                                $add: ["$$value.balance", "$$this.amount"]
                                            },
                                            type: {
                                                $cond: {
                                                    if: { $lt: ["$$this.amount", 0] }, then: "Debit", else: "Credit"
                                                }
                                            }
                                        }
                                    ]
                                ]
                            }
                        }
                    }
                }
            }
        },

        {
            $unwind: "$temp_field.results"
        },

        {
            $project: {
                _id: "$temp_field.results._id",
                balance: "$temp_field.results.balance",
                type: "$temp_field.results.type"
            }
        }


    ])


    await Promise.all(
        (await check.toArray()).map(async item => {
            currRecord += 1;
            Log.info(`Updating Documents for Id ${item._id}  ${currRecord}/${totaldocs}`)

            try {

                const res = await collection.updateMany(
                    { _id: item._id }, { $set: { balance: item.balance, type: item.type } })

                if (res.modifiedCount) {
                    Log.info(`Updating Documents ${currRecord}/${totaldocs}`)
                } else {
                    Log.info(`Updating Documents ${currRecord}/${totaldocs} (No Modification)`)
                }

            } catch (err) {
                Log.info("Updating Records Falied");
                failRecords += 1
            }


        })
    )
    Log.info("Total Records " + currRecord)
    Log.info("Total Success " + (currRecord - failRecords))
    Log.info("Total Records Failed " + failRecords)
    try {

        client.close();
        Log.info("Database Connection Closed Status: Success");


    } catch (error) {
        Log.info("Database is not closed", error);
        return
    }

}
addF()



