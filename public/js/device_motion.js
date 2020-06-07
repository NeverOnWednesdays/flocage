function check_device_motion() {

	console.log("allo");
	if (window.DeviceMotionEvent == undefined) {
		alert("no accelerometer");
	}
	else {
		alert("accelerometer found");
		window.addEventListener("devicemotion", accelerometerUpdate, true);
	}
}

window.addEventListener('load', function () {
	  check_device_motion();
})
