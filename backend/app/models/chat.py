from sqlalchemy import Column, Integer, Text

from app.db.database import Base

class Chatbot(Base):
    __tablename__ = "chatbots"

    id = Column(Integer, primary_key=True, index=True)
    message = Column(Text, nullable=False)
    # If it needs to be linked to a user, it wasn't in dbschema.sql but typically it is.
    # Leaving it as per dbschema.sql for now.
