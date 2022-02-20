import ClassFactoryService from "../services/ClassFactoryService";

export default async function(req, res, next) {
    const { token } = req.cookies
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