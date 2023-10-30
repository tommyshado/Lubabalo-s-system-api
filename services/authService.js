
const authService = (database) => {

    const createUser = async (user) => {
        const data = [
            user.name,
            user.email,
            user.password,
        ];
        await database.none("insert into user_signup (username, email, password) values ($1, $2, $3)", data);
    };

    const getUsers = async () => await database.manyOrNone("select * from user_signup");

    const checkUser = async (user) => await database.oneOrNone(`select * from user_signup where username = '${user.username}' or email = '${user.email}'`);

    const getPassword = async (user) => await database.oneOrNone(`select password from user_signup where email = '${user.email}'`);

    return {
        createUser,
        getUsers,
        checkUser,
        getPassword
    };
};

export default authService;