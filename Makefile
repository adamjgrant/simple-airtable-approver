build:
	sleep 3; open http://localhost:3001 &
	python3 -m http.server 3001
