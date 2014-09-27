/*
	Huntlytics - Product Hunt Analytics - Controller.js
    Copyright (C) 2014 Shubham Naik

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

*/

//ugh documentation sucks...

var ampm = function(hour){
	if(hour <= 11){
		hour = hour + 'am'
	} else if(hour === 0){
		hour = '12am'
	} else if(hour === 12){
		hour = '12pm'
	} else {
		hour = (hour - 12) + 'pm'
	}
	return hour;
}

var load = function(pid){
	window.history.pushState("hi", "Huntlytics", "/p/" + pid); // changeurl
	$('.psudo-content').hide();
	$('.loading-e, .top-products').hide();
	$('.loading').show();
	$('.content').hide();
	$.ajax({
		 url: "/hunt",
		 type: "GET",
		 data: {id:pid},
		 success: function(data) {
			var datasets = [];
			var times = []
			$('#regions, #voters, #sex, #jobs, #interests').html('');
			 $('#productname').html(data.name);
			 $('#productdesc').html(data.tagline);
			 $('#votecount').html(data.votes_count);
			 $('#datepost').html((data.day).replace(new RegExp(/-/g), '/'));
			 $('#commentcount').html(data.comments_count);
			 $('.canvas-holder').html('<canvas id="cancan" width=960 height=250>');
			 if(data.votes_count < 5){
				$('.loading-e').show();
			 }
			if(data.vote_historical === undefined){
				datasets[0] = 0;
				datasets[1] = data.votes_count;
			} else {
				datasets = data.vote_historical;
				datasets.push(data.votes_count)
			}
			var tot = 0;
			if(data.times === undefined){
				tot = 1;
			} else {
				tot = data.times.length;
			}
			for(var i = 0; i < tot; i++){
				if(data.times != undefined){
					var a = new Date(data.times[i])
					a = a.getHours();
					times[i] = ampm(a);
				}
				if(i === tot - 1){
					if(data.times === undefined){
						times = ['12am', 'now']
					} else {
						times.push('now');
					}
					var g = {scaleBeginAtZero: true, datasetStrokeWidth : 2, pointDot : false, scaleShowGridLines : true,  bezierCurve : false}
					var e = {
						labels: times,
						datasets: [
							{
								label: "Votes",
								fillColor: "rgba(151,187,205,0.0)",
								strokeColor: "#2abcf2",
								pointColor: "#2abcf2",
								pointStrokeColor: "#fff",
								pointHighlightFill: "#fff",
								pointHighlightStroke: "rgba(220,220,220,1)",
								data: datasets
							}
						]
						
					}
					 var ctx = document.getElementById('cancan').getContext("2d");
									var myLineChart = new Chart(ctx).Line(e, g);
									$('#key_reach').html(data.discussion_url);
				}
			}
			 $.ajax({
				 url: "/stats/posts",
				 type: "GET",
				 data: {term:data.discussion_url},
				 success: function(data) {
					$('#reach').html(data.reach);
					$('#items').html('');
					
					if(data.status.length != 0){
					if(data.status.length > 3){
						 data.status.length = 3;
					} 
					for(var i = 0; i < data.status.length; i++){
						$('#items').append("<a style='color:inherit' target='_blank' href='http://twitter.com/" + data.status[i].user.screen_name + '/status/' + data.status[i].id_str + "'><div class='post-container'>" + data.status[i].text + "<div class='post-source'>"+ data.status[i].user.screen_name + " (@" + data.status[i].user.name + ")</div></div></a>");
					}	
					} else {
						$('#items').html("<div style='margin-top:20px; text-align:center;' class='content-title-d'><b>No Recent Tweets</b> <br> This does not mean that there's no discussion. Just no Product Hunt related discussions.</div>")
					}
				 },
			   error:function(data){
				 alert('An error happened, dont worry just refresh and try a different id, but if it persists go tell @theforthwall on twitter, this: <br>'  + JSON.stringify(data));   
			   }
			  }); 
			 var nextid = '';
			 var ape = data.votes_count;
			 var data = {};			
				$.ajax({
					 url: "/stats/vote",
					 type: "GET",
					 data: {id:pid, next:nextid, total:ape},
					 success: function(data) {
							
							
							//list the top users
								other = 0;
								tot = 0;
								epoc = 4;

								for(var i = 0; i < data.followers.length; i++){
									
									if(i < 4){
										$('#voters').append("<a href='http://producthunt.com/" + data.followers[i][0] +"' target='_blank'><div data-id='" + data.followers[i][5] + "' class='profile'><div class='profile-image'><img class='profile-image' src='" + data.followers[i][4] + "'></div><div class='profile-user'><div class='profile-user-name'>" + data.followers[i][1] +"</div><div class='profile-user-username'>@" + data.followers[i][0] + "</div></div><div class='profile-count'>" + data.followers[i][2] + "</div></div></a>");
									}
									
									if(i < 5){
										if(data.locations[0][i] != undefined && data.locations[0][i] != ''){
											$('#regions').append('<div class="table-row"><div class="table-a">' +data.locations[0][i]+'</div><div class="table-b">' + Math.round((parseFloat(data.locations[1][i])/data.followers.length)*100) + '%</div></div>');
										}
										if(data.descriptions[0][i] != undefined && data.descriptions[0][i] != ''){
											$('#jobs').append('<div class="table-row"><div class="table-a">' +data.descriptions[0][i]+'</div><div class="table-b">' + Math.round((parseFloat(data.descriptions[1][i])/ape)*100) + '%</div></div>');
										}
										if(data.interests[0][i] != undefined && data.interests[0][i] != ''){
											$('#interests').append('<div class="table-row"><div class="table-a">' +data.interests[0][i]+'</div><div class="table-b">' + Math.round((parseFloat(data.interests[1][i])/ape)*100) + '%</div></div>');
										}
									}
									tot = data.followers[i][3] + tot;
									if(i === data.followers.length - 1){
										$('#preach').html(convert(tot));					
									}
								}
								$('#sex').append('<div class="table-row"><div class="table-a">Male</div><div class="table-b">' + Math.round((parseFloat(data.sex.male)/ape)*100) + '%</div></div>');
								$('#sex').append('<div class="table-row"><div class="table-a">Female</div><div class="table-b">' + Math.round((parseFloat(data.sex.female)/ape)*100) + '%</div></div>');
							// list top locations
							
							
									
							/*
							
							
							
							
							var top = data.locations[1].length;
							var topf = data.followers.length;
							var topd = data.descriptions[1].length;
							if(data.locations[1].length > 5){
								top = 5;
							}
							var topf = data.followers.length;
							if(data.followers.length > 20){
								topf = 20;
							}
							var topd = data.descriptions[1].length;
							if(data.descriptions[1].length > 5){
								topd = 6;
							}

							for(var i = 0; i < topd; i++){
							 
							}
							*/
							/* gender */
							 //$('#genders').append('<font class="data-ti">' +data.sex+'</font>' + ' ' + data.descriptions[0][i] + '<br>');
							
							$('.loading').hide();
							$('.content').show();
					},
				   error:function(data){
					 alert('An error happened, dont worry just refresh and try a different id, but if it persists go tell @theforthwall on twitter, this: <br>'  + JSON.stringify(data));   
				   }
				  }); 
		},
	   error:function(data){
		 alert('An error happened, dont worry just refresh and try a different id, but if it persists go tell @theforthwall on twitter, this: <br>'  + JSON.stringify(data));   
	   }
	  }); 
var convert = function(data) {
		var re = data;
		if(data >= 1000){
		
			re = Math.round(10*(data/1000))/10 + 'K'
		}
		if(data >= 1000000){
			re = Math.round(10*(data/1000000))/10 +'M'
		}
		return re;
	}			  

}


$(document).ready(function(){
	if($('.top-products').is(':visible') === true){
		$('.top-products').html('') //jic
		$.ajax({
			 url: "/hunt/all",
			 type: "GET",
			 success: function(data) {
				for(var i = 0; i < data.length; i++){
						$('.top-products').append('<div class="chg-into" data-id="' + data[i].id + '"><b>' + data[i].name + '</b> | votes: '+ data[i].votes_count + ' comments: ' + data[i].comments_count + '</div>')
				}
			 },
		   error:function(data){
				alert('An error happened, dont worry just refresh, but if it persists go tell @theforthwall on twitter, this: <br>' + JSON.stringify(data));   
		   }
		  });
	  }

	$('.search').keypress(function(e) {
		var pid = $(this).val();
		if(e.which == 13) {
		   load(pid);
		  }
	  });
	if($('.starter').is(':visible') === true){
		var pid = $('.starter').data('id');
		load(pid);
	}
});

$(document).on('click', '.chg-into', function(){
	var pid = $(this).data('id');
	load(pid);
});

$(document).on('click', '.sidebar-item', function(){
	
	
	if($('.content-about').is(':visible')===true){
		$('.solid').show();
		$('.content-about').hide()
	} else {
		$('.solid').hide();
		$('.content-about').show()
	}
});

