function makeTable(data, tableId, W) {
	var rows = [];
	var table = document.createElement("table");
	for (var i = 0; i < data.length; i++) {
		rows.push(table.insertRow(-1));
		for (var j = 0; j < W; j++) {
			var cell = rows[i].insertCell(-1);
			if (j === 0) {
				var aTag = document.createElement("a");
				aTag.href = "http://judge.u-aizu.ac.jp/onlinejudge/description.jsp?id=" + data[i][0] + "&lang=jp";
				aTag.target = "_blank";
				aTag.appendChild(document.createTextNode(data[i][j]));
				cell.appendChild(aTag);
				cell.style.backgroundColor = (i % 2 === 0 ? "#eeeeee" : "#cccccc");
				cell.style.textAlign = "center";
			} else if (data[i][j] !== undefined) {
				cell.appendChild(document.createTextNode(data[i][j]));
				cell.style.backgroundColor = (i % 2 === 0 ? "#88ff88" : "#66dd66");
			} else {
				cell.style.backgroundColor = (i % 2 === 0 ? "#dddddd" : "#bbbbbb");
			}
		}
	}
	document.getElementById(tableId).appendChild(table);
}
function getUrlVars() {
	var vars = {};
	var param = location.search.substring(1).split('&');
	for (var i = 0; i < param.length; i++) {
		var keySearch = param[i].search(/=/);
		var key = '';
		if (keySearch !== -1) {
			key = param[i].slice(0, keySearch);
		}
		var val = param[i].slice(param[i].indexOf('=', 0) + 1);
		if (key !== '') {
			vars[key] = decodeURI(val);
		}
	}
	return vars;
}
window.onload = function () {
	var parameters = getUrlVars();
	var userId = (parameters['user'] !== undefined ? parameters['user'].split('+') : []);
	var userData = [];
	var userSolution = [];
	var cnt = 2 * userId.length;
	for (var i in userId) {
		var user = userId[i];
		var request = new XMLHttpRequest();
		request.open("GET", "https://judgeapi.u-aizu.ac.jp/users/" + user);
		request.responseType = "json";
		request.addEventListener("load", function (i) {
			return function (event) {
				if (event.target.status === 200) {
					userId[i] = event.target.response.id;
					userData[i] = event.target.response;
				} else {
					userData[i] = null;
				}
				if (0 === --cnt) {
					done();
				}
			};
		}(i));
		request.send();
	}
	for (var i in userId) {
		var user = userId[i];
		var request = new XMLHttpRequest();
		request.open("GET", "https://judgeapi.u-aizu.ac.jp/solutions/users/" + user + "?page=0&size=999999999");
		request.responseType = "json";
		request.addEventListener("load", function (i) {
			return function (event) {
				userSolution[i] = event.target.response;
				if (0 === --cnt) {
					done();
				}
			};
		}(i));
		request.send();
	}
	var changeITP = function (s) {
		var a = s.split('_');
		return '!' + a[0] + (100 + Number(a[1])) + a[2];
	};
	var done = function () {
		var userIdToIndex = {};
		for (var i in userId) {
			userIdToIndex[userId[i]] = (Number(i) + 1);
		}
		var problems = {};
		for (var i in userSolution) {
			var s = userSolution[i];
			for (var j in s) {
				var a = s[j];
				var b = problems[a.problemId];
				if (b === undefined) {
					b = problems[a.problemId] = [];
					b[0] = a.problemId;
				}
				b[userIdToIndex[a.userId]] = a.userId;
			}
		}
		var data = [];
		for (var pid in problems) {
			data.push(problems[pid]);
		}
		data.sort(function (a, b) {
			a = a[0].substr(0, 3) === 'ITP' ? changeITP(a[0]) : a[0];
			b = b[0].substr(0, 3) === 'ITP' ? changeITP(b[0]) : b[0];
			if (a < b) {
				return -1;
			} else if (a > b) {
				return 1;
			}
			return 0;
		});
		makeTable(data, "table", userId.length + 1);
	};
};