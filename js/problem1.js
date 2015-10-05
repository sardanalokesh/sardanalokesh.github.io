window.onload = function() {
	var usersdata = new UsersData();
	var users = usersdata.getUsers();
	if (users.length < 1)
		alert("You need to create some records in order to used this list.");
	var usersTable = gel('usersTable');
	//var tableHeader = usersTable.getElementsByClassName('u_thead')[0];
	//var columnHeads = tableHeader.getElementsByClassName('u_th');
	var columnHeads = document.querySelectorAll('.u_thead .u_th.column_header');
	var currentSortColumn = columnHeads[1];
	currentSortColumn.dataset.sort = 1;
	sortAscending(users, currentSortColumn);
	markSortedColumn(currentSortColumn);
	loadUsers(users, usersTable);

	// enable sorting
	for (var i = 0; i < columnHeads.length; i++) {
		columnHeads[i].addEventListener('click', function(e) {
			var columnHead = e.currentTarget;
			// check if it's actually a column header
			if (columnHead.className.search('column_header') != -1) {
				if(columnHead.dataset.sort == -1 || !columnHead.dataset.sort) {
					sortAscending(users, columnHead);
					columnHead.dataset.sort = 1;
				} else {
					sortDescending(users, columnHead);
					columnHead.dataset.sort = -1;
				}
				markSortedColumn(columnHead, currentSortColumn, columnHead.dataset.sort);
				currentSortColumn = columnHead;
				loadUsers(users, usersTable);
				}
		});
	}

	//enable search
	var searchBoxes = document.querySelectorAll('#searchRow input.search_box');
	for (var i = 0; i < searchBoxes.length; i++) {
		var searchBox = searchBoxes[i];
		searchBox.addEventListener('keyup', function(e) {
			var searchBox = e.target;
			e.preventDefault();
			if (e.keyCode == 13) {
				var columns = [];
				var values = [];
				for (var j =0; j < searchBoxes.length; j++) {
					if (searchBoxes[j].value) {
						columns.push(searchBoxes[j].parentNode.dataset.column);
						values.push(searchBoxes[j].value);
					}
				}
				searchTable(columns, values, usersTable);
			}
			
		});
	}

	//enable column reordering
	for (var i = 0; i < columnHeads.length; i++) {
		var head = columnHeads[i];
		
		//getting column type
		head.addEventListener('dragstart', function(e) {
			e.dataTransfer.setData('text', e.target.dataset.column);
		});

		//enabling drag on other columns
		head.addEventListener('dragover', function(e) {
			e.preventDefault();
		});

		//displaying a dropzone to drop the column
		head.addEventListener('dragenter', function(e) {
			var currentColumn = e.target;
			addClass(currentColumn, 'column_dropzone');
		});

		//reorder columns on dropping
		head.addEventListener('drop', function(e) {
			e.preventDefault();
			reOrderColumns(e.dataTransfer.getData('text'), e.target);
			removeClass(e.target, 'column_dropzone');
		});

		//removing dropzone at end
		head.addEventListener('dragleave', function(e) {
			var currentColumn = e.target;
			removeClass(currentColumn, 'column_dropzone');
		});

	}
}

function reOrderColumns(column, refColumn) {
	var firstColumn = column;
	var secondColumn = refColumn.dataset.column;
	var firstColCells = document.querySelectorAll('div[data-column='+firstColumn+']');
	var secondColCells = document.querySelectorAll('div[data-column='+secondColumn+']');
	for (var i = 0; i < firstColCells.length; i++) {
		reOrderCells(firstColCells[i], secondColCells[i]);
	}
}

function reOrderCells(cell1, refCell) {
	var commonParent = cell1.parentNode;
	var refCellNextSibling = refCell.nextSibling;
	if (refCellNextSibling != null)
		commonParent.insertBefore(cell1, refCellNextSibling);
	else
		commonParent.appendChild(cell1);
}

function searchTable(columns, values, usersTable) {
	var allRows = usersTable.querySelectorAll('.u_tbody .u_tr');
	var foundFlag;
	for (var i = 0; i < allRows.length; i++) {
		foundFlag = true;
		var row = allRows[i];
		removeClass(row, 'search_success'); //remove existing highlights
		for (var j = 0; j < columns.length; j++) {
			var colValue = row.querySelector('.u_td[data-column='+columns[j]+']').innerHTML;
			colValue = colValue.toLowerCase();
			if (!values[j] || colValue.search(values[j].toLowerCase()) == -1)
				foundFlag = false;
		}
		if (foundFlag && values.length > 0)	
			addClass(row, 'search_success');
	}
}

function markSortedColumn(current, previous, order) {
	if (previous) {
		var icon = previous.getElementsByTagName('span')[0];
		removeClass(previous, 'current_sort_column');
		removeClass(icon, 'glyphicon-triangle-top');
		removeClass(icon, 'glyphicon-triangle-bottom');
	}
	addClass(current, 'current_sort_column');
	var icon = current.getElementsByTagName('span')[0];
	if (order == 1 || !order) {
		removeClass(icon, 'glyphicon-triangle-bottom');
		addClass(icon, 'glyphicon-triangle-top');
	} else {
		removeClass(icon, 'glyphicon-triangle-top');
		addClass(icon, 'glyphicon-triangle-bottom');
	}
}

function sortAscending(data, sortColumn) {
	data.sort(function(p1, p2) {
		return p1[sortColumn.dataset.column].localeCompare(p2[sortColumn.dataset.column]);
	});
}

function sortDescending(data, sortColumn) {
	data.sort(function(p1, p2) {
		return -1*p1[sortColumn.dataset.column].localeCompare(p2[sortColumn.dataset.column]);
	});
}

function loadUsers(users, usersTable) {

	var tbody = usersTable.getElementsByClassName('u_tbody')[0];
	tbody.innerHTML = "";
	for (var i = 0; i < users.length; i++ ) {
		var tr = document.createElement("div");
		tr.id = 'usersRow' + (i+1);
		tr.className = 'u_tr row';
		tr.draggable = "true";
		
		//getting id of row being dragged
		tr.addEventListener('dragstart', function(e) {
			e.dataTransfer.setData('text', e.target.id);
		});
		
		//allowing rows to drag on each other
		tr.addEventListener('dragover', function(e) {
			e.preventDefault();
		});
		
		//displaying a placeholder to drop the row
		var placeholder = document.createElement('div');
		placeholder.className = 'placeholder';
		tr.addEventListener('dragenter', function(e) {
			var currentRow = e.currentTarget;
			var parent = currentRow.parentNode;
			parent.insertBefore(placeholder, currentRow);
		});
		
		//allowing row to be dropped on placeholder
		placeholder.addEventListener('dragover', function(e){
			e.preventDefault();
		});

		//when dropped on placeholder, replcase the place holder with the dragged row
		placeholder.addEventListener('drop', function(e) {
			e.preventDefault();
			var parent = placeholder.parentNode;
			var draggedRow = gel(e.dataTransfer.getData('text'));
			parent.insertBefore(draggedRow, placeholder);
		});
		tr.addEventListener('dragend', function(e) {
			if (placeholder.parentNode == tbody)
				tbody.removeChild(placeholder);
		});

		var columnHeads = document.querySelectorAll('.u_thead .u_th.column_header');
		var html = "<div class='u_th col-sm-1'>" + (i+1) + "</div>";
		for (var k = 0; k < columnHeads.length; k++) {
			var columnName = columnHeads[k].dataset.column;
			if (columnName == 'email' || columnName == 'phone')
				html += "<div class='u_td col-sm-2' data-column='"+columnName+"'>" + users[i][columnName] + "</div>";
			else
				html += "<div class='u_td col-sm-1' data-column='"+columnName+"'>" + users[i][columnName] + "</div>";
		}
		tr.innerHTML = html;
		tbody.appendChild(tr);
	}
}

function gel(id) {
	return document.getElementById(id);
}

function addClass(element, uClass) {
	element.className = element.className + " " + uClass;
}

function removeClass(element, uClass) {
	element.className = element.className.replace(uClass, "").trim();
}