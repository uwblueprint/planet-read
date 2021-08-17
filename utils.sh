if [[ "$1" = "pytest" ]]
then
    if [[ "$2" = "" ]]
    then
        docker exec -it planet-read_py-backend_1 pytest
    else
        if [[ "$3" = "" ]]
        then
            # TODO improvement - parse from backend/ path location
            # right now, has to be from app/...
            docker exec -it planet-read_py-backend_1 pytest $2
        else
            # super detailed, match a test name pattern
            docker exec -it planet-read_py-backend_1 pytest $2 -k "$3" -vv
        fi
    fi
elif [[ "$1" = "enter-db" ]]
then
    ROOT_PASSWORD=$(grep MYSQL_ROOT_PASSWORD .env | cut -d '=' -f2)
    docker exec -it planet-read_db_1 mysql -u root -p$ROOT_PASSWORD
else
    echo "Invalid command."
fi
