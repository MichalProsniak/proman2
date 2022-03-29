from flask import Flask, render_template, url_for
from dotenv import load_dotenv
from util import json_response
import mimetypes
import queries

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
load_dotenv()


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """

    return render_template('index.html')


@app.route("/api/boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return queries.get_boards()


@app.route("/api/boards/<int:board_id>/cards/")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belong to a board
    :param board_id: id of the parent board
    """
    return queries.get_cards_for_board(board_id)


@app.route("/api/statuses")
@json_response
def get_statuses():
    """
    All the statuses
    """
    return queries.get_all_columns_names()


@app.route("/rename-board-by-id/<int:board_id>/<string:board_title>", methods=["POST"])
@json_response
def rename_board_by_id(board_id, board_title):
    queries.rename_board_by_id(board_id, board_title)


@app.route("/rename-column-by-id/<int:column_id>/<string:column_title>", methods=["POST"])
@json_response
def rename_column_by_id(column_id, column_title):
    queries.rename_column_by_id(column_id, column_title)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
