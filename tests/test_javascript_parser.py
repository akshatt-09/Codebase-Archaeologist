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


def test_parser_indexes_interfaces_types_and_variables():
    from analyzer.parsers.javascript import JavaScriptSourceParser

    parsed = JavaScriptSourceParser.parse(
        "export interface User {}\nexport type UserId = string;\nexport const API_URL = '/api';\nlet count = 0;",
        "src/types.ts",
    )
    indexed = {(symbol["name"], symbol["kind"]) for symbol in parsed["symbols"]}
    assert ("User", "interface") in indexed
    assert ("UserId", "type") in indexed
    assert ("API_URL", "constant") in indexed
    assert ("count", "variable") in indexed
