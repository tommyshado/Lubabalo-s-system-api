
-- RECORDS:

    -- SHOES TABLE:
        -- shoe_id PRIMARY KEY
        -- shoe_name VARCHAR
        -- shoe_quantity INT
        -- shoe_price INT
        -- shoe_color VARCHAR

create table stock_inventory (
    shoe_id serial PRIMARY KEY,
    shoe_name VARCHAR(30) not null,
    image BYTEA not null,
    shoe_qty numeric not null,
    shoe_price numeric not null,
    shoe_color VARCHAR(30) not null
)