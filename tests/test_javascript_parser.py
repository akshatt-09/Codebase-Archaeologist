from analyzer.parsers.javascript import JavaScriptSourceParser

def test_js_component_and_imports():
    code = """
import { useState } from 'react';
import { api } from '../services/api';

export function UserCard(props) {
    if (props.admin) {
        return <h1>Admin</h1>;
    }
    return <h1>User</h1>;
}
"""
    result = JavaScriptSourceParser.parse(code, "UserCard.jsx")
    assert len(result["imports"]) == 2
    assert len(result["functions"]) == 1
    assert result["functions"][0]["is_component"] is True
    assert result["complexity"] >= 2
