#!/bin/bash
MONGODB1=uatmongo1

echo "Starting replica set initialize"
until mongo --host ${MONGODB1}:27017 -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --eval "print(\"waited for connection\")"
do
    sleep 2
done
echo "Connection finished"
echo "Creating replica set"

# check if replica set is already initiated
RS_STATUS=$( mongo --quiet --host ${MONGODB1}:27017 -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --eval "rs.status().ok" )
if [[ $RS_STATUS != 1 ]]
then
  mongo --quiet --host ${MONGODB1}:27017 -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" <<EOF
  rs.initiate(
  {
    _id : 'mongo-rs',
    members: [
      { _id : 0, host : "uatmongo1:27017", priority: 3 },
      { _id : 1, host : "uatmongo2:27017", priority: 1 },
      { _id : 2, host : "uatmongo3:27017", priority: 1 }
    ]
  })
EOF
  else
    echo "[INFO] MongoDB setup finished. Initiating replicata set."
    mongo --quiet --host ${MONGODB1}:27017 -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD --eval "rs.initiate()" > /dev/null
  fi
else
  echo "[INFO] Replication set already initiated."
fi

echo "replica set created"