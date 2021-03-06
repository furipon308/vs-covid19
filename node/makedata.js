const fs = require('fs')
const fetch = require('node-fetch')
const util = require('./util.js')

const fetchText = async function(url) {
  const data = await (await fetch(url)).text()
	return data
}
const fetchGoogleSpreadSheetCSV = async function(key) {
	const csvurl = `https://docs.google.com/spreadsheets/d/e/${key}/pub?gid=1523639335&single=true&output=csv`
  const csv = await fetchText(csvurl)
  return csv
}
const makeSupport = async function() {
  const key = '2PACX-1vS92FFvTP6VBPu-ZHnJOYitgzQY0gyKCiOBWJoyLkkV4lIQ4Se6rGxgMVP7pFLOoG4ywi7l43TR0Ou9'
  const fn = 'vscovid19-data'
  const csv = await fetchGoogleSpreadSheetCSV(key)
  let csvold = null
  try {
    csvold = fs.readFileSync(fn + '.csv')
  } catch (e) {
  }
  if (csvold == csv) {
    console.log('no updates')
    return false
  }
  const date = '-' + util.getYMDHMS()
  fs.writeFileSync(fn + '.csv', csv)
  fs.writeFileSync('data/' + fn + date + '.csv', csv)
  const data = util.convertCSVtoArray(csv)
	const json = util.csv2json(data)
  console.log(json)
  const sjson = JSON.stringify(json)
  fs.writeFileSync(fn + '.json', sjson)
  fs.writeFileSync('data/' + fn + date + '.json', sjson)
  console.log(json.length)
  return true
}
const main = async function() {
  makeSupport()
}
if (require.main === module) {
  main()
}
exports.updateData = makeSupport
