
const authService = (database) => {

    const createUser = async (user) => {
        const data = [
            user.name,
            user.email,
            user.password,
        ];
        await database.none("insert into user_signup (name, email, password) values ($1, $2, $3)", data);
    };

    const getEmail = async (email) => {
        await database.oneOrNone(`select * from user_signup where email = '${email}'`);
    };

    const getPassword = async (user) => {
        await database.oneOrNone(`select password from user_signup where name = '${user.name}'`);
    };

    return {
        createUser,
        getEmail,
        getPassword
    };
};

export default authService;