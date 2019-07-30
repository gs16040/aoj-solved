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
	var cnt = userId.length;
	var percent = document.getElementById('percent');
	var percentText = document.getElementById('percent-text');
	percentText.innerHTML = 0.00;
	for (var i in userId) {
		var user = userId[i];
		var request = new XMLHttpRequest();
		request.open("GET", "https://judgeapi.u-aizu.ac.jp/solutions/users/" + user + "?page=0&size=999999999");
		request.addEventListener("load", function (i) {
			return function (event) {
				userSolution[i] = JSON.parse(event.target.responseText);
				--cnt;
				percentText.innerHTML = 100 * (userId.length - cnt)/userId.length;
				if (0 === cnt) {
					percent.style.display = 'none';
					done();
				}
			};
		}(i));
		request.withCredentials = true;
		request.send();
	}
	var courses = function (s) {
		var a = s.split('_');
		switch(a[0]){
			case 'ITP1' : return '!'+(1000+Number(a[1]))+a[2];
			case 'ALDS1': return '!'+(2000+Number(a[1]))+a[2];
			case 'ITP2' : return '!'+(3000+Number(a[1]))+a[2];
			case 'DSL'  : return '!'+(4000+Number(a[1]))+a[2];
			case 'DPL'  : return '!'+(5000+Number(a[1]))+a[2];
			case 'GRL'  : return '!'+(6000+Number(a[1]))+a[2];
			case 'CGL'  : return '!'+(7000+Number(a[1]))+a[2];
			case 'NTL'  : return '!'+(8000+Number(a[1]))+a[2];
			default: return s;
		}
	};
	var done = function () {
		var problems = {};
		for (var i in userSolution) {
			var s = userSolution[i];
			for (var j=0; j<s.length; ++j) {
				var a = s[j];
				var b = problems[a.problemId];
				if (b === undefined) {
					b = problems[a.problemId] = [];
					b[0] = a.problemId;
				}
				b[Number(i) + 1] = a.userId;
			}
		}
		var data = [];
		for (var pid in problems) {
			data.push(problems[pid]);
		}
		data.sort(function (a, b) {
			a = courses(a[0]);
			b = courses(b[0]);
			return a<b?-1:a>b?1:0;
		});
		makeTable(data, "table", userId.length + 1);
	};
};
