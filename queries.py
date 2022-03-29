import data_manager
from psycopg2 import sql


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


def add_board(cursor, new_title):
    query = """
    INSERT INTO boards (title)
    VALUES (%s);"""
    cursor.execute(query, (new_title,))


@data_manager.connection_handler
def delete_specific_card(cursor, card_id):
    cursor.execute(
        sql.SQL("""
            DELETE FROM cards 
            WHERE id = {card_id};
        """).format(card_id=sql.Literal(card_id), )
    )
