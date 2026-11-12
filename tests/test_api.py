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


def test_search_before_analysis_returns_empty_results(client):
    res = client.get('/api/search?q=anything')
    assert res.status_code == 200
    assert res.json == {"symbols": [], "files": [], "contentMatches": []}


def test_health_history_before_analysis_returns_empty_history(client):
    res = client.get('/api/health-history')
    assert res.status_code == 200
    assert res.json["history"] == []


def test_invalid_github_repository_url_is_rejected(client):
    res = client.post('/api/analyze-github', json={"url": "https://github.com/owner/repo/tree/main"})
    assert res.status_code == 400
