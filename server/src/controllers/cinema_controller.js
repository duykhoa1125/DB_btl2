const CinemaService = require("../services/cinema_service")
class CinemaController {
    async getAll(req, res){
        try {
            const cinemas = await CinemaService.getAll();
            res.json({ success: true, data: cinemas });
        } catch (error) {
            res.status(500).json({success: false, error: error.message});
        }
    }
    async getById(req, res){
        try {
            const id = req.params.id;
            
            const cinemas = await CinemaService.getById(id);
            res.json({ success: true, data: cinemas });
        } catch (error) {
            res.status(500).json({success: false, error: error.message});
        }
    }
}

module.exports = new CinemaController();
