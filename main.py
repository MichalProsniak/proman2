from flask import Flask, render_template, url_for, request, session, redirect
from dotenv import load_dotenv
from util import json_response
import mimetypes
import queries
import data_manager

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
load_dotenv()
app.secret_key = "qwerty"

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

@app.route("/api/max-id")
@json_response
def get_max_id():
    return queries.get_last_id()



@app.route("/rename-board-by-id/<int:board_id>/<string:board_title>", methods=["POST"])
@json_response
def rename_board_by_id(board_id, board_title):
    queries.rename_board_by_id(board_id, board_title)


@app.route("/rename-column-by-id/<int:column_id>/<string:column_title>", methods=["POST"])
@json_response
def rename_column_by_id(column_id, column_title):
    queries.rename_column_by_id(column_id, column_title)


@app.route("/add-board/<string:board_title>", methods=["POST"])
@json_response
def new_board(board_title):
    queries.add_board(board_title)


@app.route("/delete-card/<int:card_id>", methods=["POST"])
@json_response
def delete_card(card_id):
    queries.delete_specific_card(card_id)


@app.route("/registration", methods=['GET', 'POST'])
def registration():
    alert = data_manager.is_logged(session)
    if alert is False:
        return redirect('/')
    if request.method == 'GET':
        return render_template('registration.html', alert=alert)
    username = request.form['username']
    password = request.form['password']
    username_exists = data_manager.user_registration(username, password)
    if not username_exists:
        return redirect('/')
    else:
        return render_template('registration.html', error='Username already exists!', alert=alert)


@app.route("/login", methods=['GET', 'POST'])
def login():
    alert = data_manager.is_logged(session)
    if alert is False:
        return redirect('/')
    if request.method == 'GET':
        return render_template('login.html', alert=alert)
    username = request.form['username']
    plain_text_password = request.form['password']
    if queries.username_exists(username):
        hashed_password = queries.get_password(username)
        if data_manager.verify_password(plain_text_password, hashed_password):
            session['username'] = username
            session['user_id'] = queries.get_user_id(username)
            return redirect('/')
    error_message = 'Invalid username or password!'
    return render_template('login.html', error_message=error_message, alert=alert)


@app.route('/logout')
def logout():
    alert = data_manager.is_logged(session)
    if alert is True:
        return redirect('/login')
    session.pop('username', None)
    session.pop('user_id', None)
    return redirect('/')


@app.route("/api/<int:board_id>/<int:status_id>/<string:card_title>", methods=["POST"])
@json_response
def add_new_card(card_title, board_id, status_id):
    card_number = queries.get_card_order(board_id, status_id)
    print(card_number)
    if card_number[0]['max'] is None:
        new_card_number = 1
    else:
        new_card_number = int(card_number[0]['max']) + 1
    queries.add_new_card_to_board(card_title, board_id, status_id, new_card_number)


@app.route("/api/new-card")
@json_response
def get_new_card_data():
    return queries.get_all_new_card_data()


@app.route("/api/delete-board/<int:board_id>", methods=["POST"])
@json_response
def delete_specific_board(board_id):
    queries.delete_all_cards_from_board(board_id)
    queries.delete_board(board_id)


def main():
    app.run(debug=True)
    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
