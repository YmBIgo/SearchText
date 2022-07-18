const bodyParser = require("body-parser")
const express = require("express")
const cors = require("cors")
const axios   = require("axios")

const goo_keyword_api_key = process.env.GOO_API_KEY

const cors_options = {
	origin: "http://localhost:3000",
	optionsSuccessStatus: 200
}

const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())

const server = app.listen(3001, function() {
	console.log("Node.js is listening to PORT: " + server.address().port)
})

app.post("/api/goo_keyword/", function(req, res, next){
	// get parameters from body
	console.log(req.body)
	const title  = req.body.title
	const body   = req.body.body
	const max_num = (Math.ceil(body.length / 100) - 1) * 2
	// 
	if (!title || !body) {
		res.json({"status": "error", "message": "can not get parameter data."})
		return
	}
	let params = new URLSearchParams()
	params.append("app_id", goo_keyword_api_key)	
	params.append("title", title)
	params.append("body", body)
	params.append("max_num", max_num)
	const config = {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		}
	}
	axios.post(
		"https://labs.goo.ne.jp/api/keyword",
		params,
		config
	).then((result) => {
		// console.log(result.data)
		const fixed_result_data = result.data.keywords.map((k) => {
			return Object.keys(k)[0]
		})
		const success_response_json = {"status": "success", "keywords": fixed_result_data}
		res.json(success_response_json)
		return
	})
})