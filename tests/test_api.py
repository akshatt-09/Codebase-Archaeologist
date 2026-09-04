import pytest
from backend.app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_endpoint(client):
    res = client.get('/api/health')
    assert res.status_code == 200
    assert res.json["status"] == "online"

def test_summary_before_analysis(client):
    res = client.get('/api/summary')
    assert res.status_code == 200
    assert res.json["analyzed"] is False
