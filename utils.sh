if [[ "$1" = "pytest" ]]
then
    docker exec -it planet-read_py-backend_1 pytest
elif [[ "$1" = "enter-db" ]]
then
    docker exec -it planet-read_db_1 mysql -u "root password" -proot
else
    echo "Invalid command."
fi