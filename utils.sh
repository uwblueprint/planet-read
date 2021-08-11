if [[ "$1" = "pytest" ]]
then
    if [[ "$2" = "" ]]
    then
        docker exec -it planet-read_py-backend_1 pytest
    else
        # TODO improvement - parse from backend/ path location
        # right now, has to be from app/...
        docker exec -it planet-read_py-backend_1 pytest $2
    fi
elif [[ "$1" = "enter-db" ]]
then
    ROOT_PASSWORD=$(grep MYSQL_ROOT_PASSWORD .env | cut -d '=' -f2)
    docker exec -it planet-read_db_1 mysql -u $ROOT_PASSWORD -proot
else
    echo "Invalid command."
fi
