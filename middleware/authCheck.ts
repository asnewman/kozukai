import ClassFactoryService from "../services/ClassFactoryService";

export default async function(req, res, next) {
    const { token } = req.cookies
    try {
        const supabaseClient = ClassFactoryService.supabaseClient
        const { user } = await supabaseClient.auth.api.getUser(token)

        if (user) {
            req.user = user
            next()
        }
        else {
            return res.redirect("/login")
        }
    }
    catch(e) {
        console.error(e);
        return res.status(500).send("Internal error. Please message ash@kozukaihabit.com for support.")
    }
}