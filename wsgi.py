
import sys
import os

# Proje dizinine git
project_home = os.path.expanduser('~/kobi-ai-railway')
if project_home not in sys.path:
    sys.path.insert(0, project_home)

from backend.main import app as application
