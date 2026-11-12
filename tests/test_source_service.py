from backend.services.source_service import read_source_window


def test_source_window_preserves_line_numbers_and_bounds_output(tmp_path):
    source = tmp_path / "large.txt"
    source.write_text("".join(f"line-{number}\n" for number in range(1, 1001)), encoding="utf-8")
    result = read_source_window(str(source), requested_line=500, window=200)
    assert result["startLine"] == 400
    assert result["totalLines"] == 1000
    assert result["truncated"] is True
    assert result["content"].splitlines()[100] == "line-500"
    assert len(result["content"].splitlines()) == 200


def test_source_window_moves_to_file_end_for_out_of_range_line(tmp_path):
    source = tmp_path / "small.txt"
    source.write_text("one\ntwo\nthree\n", encoding="utf-8")
    result = read_source_window(str(source), requested_line=99, window=100)
    assert result["startLine"] == 1
    assert result["totalLines"] == 3
    assert result["content"].splitlines() == ["one", "two", "three"]
