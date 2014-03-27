	var this_player, player_1, player_2, player_3, player_4;
	//({"src":null, "xcoor":null, "ycoor":null, "health":null, "damage":null, "range":null, "movement":null "can_move":null})
	var player_1_units = new Array();
	player_1_units.push({src:"goblin-icon.png", xcoor:null, ycoor:null, health:2, damage:1, range:2, movement:2, can_move:true, can_attack:true});
	player_1 = "Annoth";
	this_player = "Annoth"
	var player_2_units = new Array();
	var player_3_units = new Array();
	var player_4_units = new Array();
	var events_locked = false;
	var last_event =
	{
		type:null,
		action:null,
		xcoor:null,
		ycoor:null
	};	
	
	var count = 0;
	
	//Makes finding selected unit easier.
	var selected_unit =
	{
		owner:null,
		arr_index:null
	};
	//var ws = new WebSocket("");
	
	function getTeamColor(player_name)
	{
		if(player_name == player_1)
		{
			return "blue";
		}
		else if(player_name == player_2)
		{
			return "teal"
		}
		else if(player_name == player_3)
		{
			return "orange"
		}
		else if(player_name == player_4)
		{
			return "purple"
		}
	}
	
	function getAbsoluteFromGrid(coor)
	{
		return 23+43*coor;
	}
	
	function addTile(xcoor, ycoor)
	{
		var id = "X"+xcoor.toString()+"Y"+ycoor.toString();
		try
		{
		addImage(id, "test2.gif", getAbsoluteFromGrid(xcoor), getAbsoluteFromGrid(ycoor), 1, 40, 40);
		document.getElementById(id).onclick = function() { sendEvent("Lclick", xcoor, ycoor); return false; };
		document.getElementById(id).oncontextmenu = function() { sendEvent("Rclick", xcoor, ycoor); return false; };
		}
		catch(err)
		{
		alert(err);
		}
	}
	
	function addImage(id, src, left, top, z, width, height)
	{
		try
		{
			var img_new = document.createElement("img");
			img_new.id=id;
			img_new.src=src;
			img_new.style.display="block";
			img_new.style.position="absolute";
			img_new.style.top=top.toString()+"px";
			img_new.style.left=left.toString()+"px";
			img_new.style.zIndex=z.toString();
			img_new.style.width=width.toString()+"px";
			img_new.style.height=height.toString()+"px";
			img_new.ondragstart=function(){return false;};
			img_new.ondrop=function(){return false;};
			var div_tiles = document.getElementById("div_tiles");
			div_tiles.appendChild(img_new);
		}
		catch(err)
		{
			alert(err);
		}
	}
	
	function moveSelectionBox(xcoor, ycoor)
	{
		var border_width = 3;
		var selection_box = document.getElementById("selection");
		if(selection_box == null)
		{
			addImage("selection", "selection.png", getAbsoluteFromGrid(xcoor)-border_width, getAbsoluteFromGrid(ycoor)-border_width, 3, 46, 46);
		}
		else
		{
			selection_box.style.left = (getAbsoluteFromGrid(xcoor)-border_width).toString()+"px";
			selection_box.style.top = (getAbsoluteFromGrid(ycoor)-border_width).toString()+"px";
			selection_box.style.display="block";
		}
	}
	
	function findUnitList(player_name)
	{
		var unit_list;
		if(player_name==player_1)
		{
			unit_list = player_1_units;
		}
		else if(player_name==player_2)
		{
			unit_list = player_2_units
		}
		else if(player_name==player_3)
		{
			unit_list = player_3_units
		}
		else if(player_name==player_4)
		{
			unit_list = player_4_units
		}
		return unit_list;
	}
	
	function clearSelection()
	{
		selected_unit.owner = null;
		selected_unit.arr_index = null;
		document.getElementById("stat_hp").innerHTML = "";
		document.getElementById("stat_damage").innerHTML = "";
		document.getElementById("stat_movement").innerHTML = "";
		document.getElementById("stat_range").innerHTML = "";
		document.getElementById("stat_ability").innerHTML = "";
		document.getElementById("stat_log").innerHTML = "";
		document.getElementById("stat_icon").src = "";
		document.getElementById("selection").style.display="none";
	}
	
	function changeStatsGraphical(stats)
	{
		if(stats.src!=null)
		{
			document.getElementById("stat_icon").src = stats.src;
		}
		if(stats.health!=null)
		{
			document.getElementById("stat_hp").innerHTML = stats.health.toString();
		}
		if(stats.damage!=null)
		{
			document.getElementById("stat_damage").innerHTML = stats.damage.toString();
		}
		if(stats.range!=null)
		{
			document.getElementById("stat_range").innerHTML = stats.range.toString();
		}
		if(stats.movement!=null)
		{
			document.getElementById("stat_movement").innerHTML = stats.movement.toString();
		}
	}
	
	function select(xcoor, ycoor, unit_owner)
	{
		var src = "";
		var health = 0;
		var movement = 0;
		var damage = 0;
		var range = 0;
		var unit_list;
		var stats =
		{
			src:null,
			health:null,
			movement:null,
			damage:null,
			range:null
		};
		selected_unit.owner = unit_owner;
		unit_list = findUnitList(unit_owner);
		for(var i = 0; i < unit_list.length; ++i)
		{
			if(unit_list[i].xcoor == xcoor)
			{
				if(unit_list[i].ycoor == ycoor)
				{
					stats.src = unit_list[i].src;
					stats.health = unit_list[i].health;
					stats.movement = unit_list[i].movement;
					stats.damage = unit_list[i].damage;
					stats.range = unit_list[i].range;
					
					selected_unit.arr_index = i;
				}
			}
		}
		changeStatsGraphical(stats);
		moveSelectionBox(xcoor, ycoor);
	}
	
	function endturn(nextPlayer)
	{
		if(nextPlayer == this_player)
		{
			events_locked = false;
		}
		else
		{
			events_locked = true;
		}
		document.stat_player_turn.innerHTML = nextPlayer;
		clearSelection();
	}
	
	function place(xcoor, ycoor, player_name, nth_unit)
	{
		var unit_list = findUnitList(player_name);
		unit_list[nth_unit].xcoor = xcoor;
		unit_list[nth_unit].ycoor = ycoor;
		var tile = document.getElementById("X"+xcoor.toString()+"Y"+ycoor.toString());
		tile.src = unit_list[nth_unit].src;
		var color = getTeamColor(player_name);
		addImage(color+nth_unit.toString(), "team_color_"+color+".png", getAbsoluteFromGrid(xcoor), getAbsoluteFromGrid(ycoor), 0, 40, 40);
	}
	
	function moveTeamColor(xcoor, ycoor)
	{
		var color = getTeamColor(selected_unit.owner);
		var team_color = document.getElementById(color+selected_unit.arr_index.toString());
		team_color.style.top = getAbsoluteFromGrid(ycoor).toString()+"px";
		team_color.style.left = getAbsoluteFromGrid(xcoor).toString()+"px";
	}
	
	function move(xcoor, ycoor)
	{
		var unit_list = findUnitList(selected_unit.owner);
		var original_xcoor = unit_list[selected_unit.arr_index].xcoor;
		var original_ycoor = unit_list[selected_unit.arr_index].ycoor;
		var original_tile = document.getElementById("X"+original_xcoor+"Y"+original_ycoor);
		var new_tile = document.getElementById("X"+xcoor+"Y"+ycoor);
		unit_list[selected_unit.arr_index].xcoor = xcoor;
		unit_list[selected_unit.arr_index].ycoor = ycoor;
		original_tile.src="test2.gif";
		new_tile.src = unit_list[selected_unit.arr_index].src;
		moveSelectionBox(xcoor, ycoor);
		moveTeamColor(xcoor, ycoor);
	}
	
	function sendEvent(action, xcoor, ycoor)
	{
		if(selected_unit.owner == null)
		{
			select(xcoor, ycoor, "Annoth");
		}
		else
		{
			move(xcoor, ycoor);
		}
		if(! events_locked || action == "Exit" )
		{
			events_locked = true;
			try
			{
				var client_event = 
				{
					"type":"Event",
					"action":action,
					"xcoor":xcoor,
					"ycoor":ycoor
				};
				//ws.send(JSON.stringify(client_event));
				if(! action == "Exit")
				{
					last_event.type="Event";
					last_event.action=action;
					last_event.xcoor=xcoor;
					last_event.ycoor=ycoor;
				}
			}
			catch(err)
			{
				events_locked = false;
			}
		}
		++count;
	}
	
	function translateServerMessage(message)
	{
		try
		{
			var decrypted = JSON.parse(message.data);
			if(decrypted.type == "Confirmation")
			{
				if(decrypted.success)
				{
					if(decrypted.action == "Select")
					{
						select(last_event.xcoor, last_event.ycoor, decrypted.whoSecondary);
					}
					else if(decrypted.action == "Endturn")
					{
						endTurn(decrypted.whoSecondary);
					}
				}
				events_locked = false;
			}
			else if(decrypted.type == "Notification")
			{
			}
		}
		catch(err)
		{
		}
	}
	