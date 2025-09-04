## Schema for Postgres sql

### Prerequisites
Having installed postgresql <br>
Ensure that psql is accessible from terminal


<b>How to run this </b><br>
Initialize postgresql
```
psql -U postgres
```

<b>In linux </b>
```
sudo -U postgres psql
```


### Create User 

```
CREATE USER your_username WITH PASSWORD 'your_secure_password';
ALTER USER your_username CREATEDB;
```

#### Verify user
```
\du
```
If the user you created shows up, it is okay 
### Create database
```
CREATE DATABASE your_database_name OWNER your_username;
```
### Grant all priviledges to the database (optional)
```
GRANT ALL PRIVILEGES ON DATABASE your_database_name TO your_username;
```
### verify your setup
```
\l
```
You should see the database you created popup here
### Exit postgres
```
\q
```

### Test connection
````
psql -U your_username -d your_database_name -h localhost
````


</br></br>

## if everything goes well you can continue
Execute this last command to populate the tables defined in the schema

```
psql -U your_username -d your_database -c "path/to/the/file/postgresql_schema.sql;"
```

And Everything should be good to go

# Database Schema and relationships

<img src='./database_diagram.svg' placeholder='database relationships image' />