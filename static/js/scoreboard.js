function updatescores () {
  $.get(script_root + '/scores', function( data ) {
    teams = $.parseJSON(JSON.stringify(data));
    $('#scoreboard > tbody').empty()
    for (var i = 0; i < teams['standings'].length; i++) {
      row = "<tr><td>{0}</td><td><a href='/team/{1}'>{2}</a></td><td>{3}</td></tr>".format(i+1, teams['standings'][i].id, htmlentities(teams['standings'][i].team), teams['standings'][i].score)
      $('#scoreboard > tbody').append(row)
    };
  });
}

function cumulativesum (arr) {
    var result = arr.concat();
    for (var i = 0; i < arr.length; i++){
        result[i] = arr.slice(0, i + 1).reduce(function(p, i){ return p + i; });
    }
    return result
}

function UTCtoDate(utc){
    var d = new Date(0)
    d.setUTCSeconds(utc)
    return d;
}
function scoregraph () {
    $.get(script_root + '/top/10', function( data ) {
        var places = $.parseJSON(JSON.stringify(data));
        places = places['places'];
        if (Object.keys(places).length === 0 ){
            $('#score-graph').html('<div class="text-center"><h3 class="spinner-error">No solves yet</h3></div>'); // Replace spinner
            return;
        }

        var teams = Object.keys(places);
        var traces = [];
        for(var i = 0; i < teams.length; i++){
            var team_score = [];
            var times = [];
            for(var j = 0; j < places[teams[i]]['solves'].length; j++){
                team_score.push(places[teams[i]]['solves'][j].value);
                var date = moment(places[teams[i]]['solves'][j].time * 1000);
                times.push(date.toDate());
            }
            team_score = cumulativesum(team_score);
            var trace = {
                x: times,
                y: team_score,
                mode: 'lines+markers',
                name: places[teams[i]]['name']
            };
            traces.push(trace);
        }

        traces.sort(function(a, b) {
            var scorediff = b['y'][b['y'].length - 1] - a['y'][a['y'].length - 1];
            if(!scorediff) {
                return a['x'][a['x'].length - 1] - b['x'][b['x'].length - 1];
            }
            return scorediff;
        });

        var layout = {
            title: 'Top 10 Teams',
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)'
        };
        console.log(traces);

        $('#score-graph').empty(); // Remove spinners
        Plotly.newPlot('score-graph', traces, layout);
    });
}

function update(){
  updatescores();
  scoregraph();
}

setInterval(update, 300000); // Update scores every 5 minutes
scoregraph();

window.onresize = function () {
    Plotly.Plots.resize(document.getElementById('score-graph'));
};
