from CTFd import create_app
import os

app = create_app()
extra_dirs = ['./static', './templates',]
extra_files = extra_dirs[:]
for extra_dir in extra_dirs:
    for dirname, dirs, files in os.walk(extra_dir):
        for filename in files:
            filename = path.join(dirname, filename)
            if path.isfile(filename):
                extra_files.append(filename)
app.run(debug=True, threaded=True, host="127.0.0.1", port=4000, extra_files=extra_files)
