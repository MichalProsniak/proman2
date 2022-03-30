import data_manager
from psycopg2 import sql
import main


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    status = data_manager.execute_select(
        """
        SELECT * FROM statuses s
        WHERE s.id = %(status_id)s
        ;"""
        , {"status_id": status_id})
    return status


def get_boards():
    """
    Gather all boards
    :return:
    """
    return data_manager.execute_select(
        """
        SELECT * FROM boards
        ORDER BY id
        ;""")


def get_cards_for_board(board_id):
    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ;"""
        , {"board_id": board_id})
    return matching_cards


def get_all_columns_names():
    return data_manager.execute_select(
        """
        SELECT * 
        FROM statuses
        ORDER BY id
        ;""")


@data_manager.connection_handler
def rename_board_by_id(cursor, board_id, board_title):
    cursor.execute(
        sql.SQL("""
            UPDATE boards
            SET title = {board_title}
            WHERE id = {board_id}
        """).format(board_id=sql.Literal(board_id), board_title=sql.Literal(board_title))
    )


@data_manager.connection_handler
def rename_column_by_id(cursor, column_id, column_title):
    cursor.execute(
        sql.SQL("""
            UPDATE statuses
            SET title = {column_title}
            WHERE id = {column_id}
        """).format(column_id=sql.Literal(column_id), column_title=sql.Literal(column_title))
    )


@data_manager.connection_handler
def add_board(cursor, new_title):
    query = """
    INSERT INTO boards (title)
    VALUES (%s)
    """
    cursor.execute(query, (new_title,))


@data_manager.connection_handler
def delete_specific_card(cursor, card_id):
    cursor.execute(
        sql.SQL("""
            DELETE FROM cards 
            WHERE id = {card_id};
        """).format(card_id=sql.Literal(card_id), )
    )


@database_common.connection_handler
def check_if_user_exist(cursor, username):
    query = """
        SELECT name FROM users WHERE name=%s"""
    cursor.execute(query, (username,))
    exist = cursor.fetchall()
    if len(exist) > 0:
        exist = True
    else:
        exist = False
    return exist


@database_common.connection_handler
def add_new_user_to_db(cursor, username, password):
    query = """
        INSERT INTO users (name, password)
        VALUES (%s, %s)"""
    cursor.execute(query, (username, password))


@database_common.connection_handler
def username_exists(cursor, username):
    query = """
        SELECT name FROM users """
    cursor.execute(query)
    all_users = [user['name'] for user in cursor.fetchall()]
    return username in all_users


@database_common.connection_handler
def get_password(cursor, username):
    query = """
        SELECT password FROM users
        WHERE name = '%s'""" % (username)
    cursor.execute(query)
    password = cursor.fetchone()
    return password['password']


@database_common.connection_handler
def get_user_id(cursor, username):
    query = """
        SELECT id
        FROM users    
        WHERE name=%s"""
    cursor.execute(query, (username,))
    user_id = cursor.fetchone()
    return user_id['id']


@data_manager.connection_handler
def add_new_card_to_board(cursor, card_title, board_id, status_id, card_number):
    query = """
        INSERT INTO cards (board_id, status_id, title, card_order)
        VALUES (%s, %s, %s, %s);"""
    cursor.execute(query, (board_id, status_id, card_title, card_number))


def get_card_order(board_id, status_id):
    card_number = data_manager.execute_select(
        """
        SELECT max(card_order) FROM cards 
        WHERE board_id = %(board_id)s 
        AND status_id = %(status_id)s
        ;"""
        , {"board_id": board_id,
            "status_id": status_id})
    return card_number


def get_all_new_card_data():
    return data_manager.execute_select(
        """
        SELECT * FROM cards
        ORDER BY id DESC
        LIMIT 1
        ;""")


@data_manager.connection_handler
def delete_all_cards_from_board(cursor, board_id):
    cursor.execute(
        sql.SQL("""
            DELETE FROM cards 
            WHERE board_id = {board_id};
        """).format(board_id=sql.Literal(board_id), )
    )


@data_manager.connection_handler
def delete_board(cursor, board_id):
    cursor.execute(
        sql.SQL("""
            DELETE FROM boards 
            WHERE id = {board_id};
        """).format(board_id=sql.Literal(board_id), )
    )
