const authService = (database) => {
    const createUser = async (user) => {
        const data = [user.name, user.email, user.password, "shopper"];
        await database.none(
            "insert into user_signup (username, email, password, role) values ($1, $2, $3, $4)",
            data
        );
    };

    const getUsers = async () => await database.manyOrNone("select * from user_signup");

    const checkUser = async ({usernameOrEmail}) => {
        const checksEmail = usernameOrEmail.includes("@");
        const filter = checksEmail ? "WHERE email = $1" : "WHERE username = $1";
        const query = `SELECT * FROM user_signup ${filter}`;

        return await database.manyOrNone(query, [usernameOrEmail]);
    };

    return {
        createUser,
        getUsers,
        checkUser
    };
};

export default authService;
