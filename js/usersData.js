function UsersData() {

	this.addUser = function(user) {
		if (browserSupport()) {
			var users = this.getUsers();
			users.push(user);
			localStorage.setItem("users", JSON.stringify(users));		

		}
	};

	this.getUsers = function() {
		if (browserSupport()) {
		var users = localStorage.getItem("users") ? JSON.parse(localStorage.getItem("users")) : [];
		return users;
		}
		return null;
	};

	function browserSupport() {
		return (typeof(Storage) !== "undefined");
	}
}