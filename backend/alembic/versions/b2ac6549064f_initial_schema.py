"""Initial schema — full table creation for fresh databases

Revision ID: b2ac6549064f
Revises: 
Create Date: 2026-06-16 10:28:25.427725

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'b2ac6549064f'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── users ────────────────────────────────────────────────
    op.create_table(
        'users',
        sa.Column('id',        sa.Integer(),     nullable=False),
        sa.Column('username',  sa.String(),      nullable=False),
        sa.Column('email',     sa.String(),      nullable=True),
        sa.Column('password',  sa.String(),      nullable=False),
        sa.Column('is_active', sa.Boolean(),     nullable=True, default=True),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_users_id'),       'users', ['id'],       unique=False)
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)
    op.create_index(op.f('ix_users_email'),    'users', ['email'],    unique=True)

    # ── profiles ─────────────────────────────────────────────
    op.create_table(
        'profiles',
        sa.Column('id',      sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('bio',     sa.Text(),    nullable=True),
        sa.Column('avatar',  sa.String(),  nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_profiles_id'), 'profiles', ['id'], unique=False)

    # ── chatbots ─────────────────────────────────────────────
    op.create_table(
        'chatbots',
        sa.Column('id',         sa.Integer(),  nullable=False),
        sa.Column('message',    sa.Text(),     nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_chatbots_id'), 'chatbots', ['id'], unique=False)

    # ── user_predict_models ───────────────────────────────────
    op.create_table(
        'user_predict_models',
        sa.Column('id',      sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('label',   sa.String(),  nullable=True),
        sa.Column('cgpa',    sa.Float(),   nullable=True),
        sa.Column('internships',    sa.Integer(), nullable=True),
        sa.Column('projects',       sa.Integer(), nullable=True),
        sa.Column('workshops',      sa.Integer(), nullable=True),
        sa.Column('aptitude_score', sa.Float(),   nullable=True),
        sa.Column('soft_skills',    sa.Float(),   nullable=True),
        sa.Column('extracurricular', sa.Integer(), nullable=True),
        sa.Column('placement_training', sa.Integer(), nullable=True),
        sa.Column('ssc_marks',  sa.Float(), nullable=True),
        sa.Column('hsc_marks',  sa.Float(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_user_predict_models_id'),      'user_predict_models', ['id'],      unique=False)
    op.create_index(op.f('ix_user_predict_models_user_id'), 'user_predict_models', ['user_id'], unique=False)

    # ── resume_uploads ────────────────────────────────────────
    op.create_table(
        'resume_uploads',
        sa.Column('id',                 sa.Integer(), nullable=False),
        sa.Column('user_id',            sa.Integer(), nullable=False),
        sa.Column('name',               sa.String(),  nullable=True),
        sa.Column('email',              sa.String(),  nullable=True),
        sa.Column('job_role',           sa.String(),  nullable=True),
        sa.Column('file',               sa.String(),  nullable=True),
        sa.Column('processed',          sa.Boolean(), nullable=True),
        sa.Column('ats_score',          sa.Float(),   nullable=True),
        sa.Column('suggestions',        sa.Text(),    nullable=True),
        sa.Column('course_products',    postgresql.JSON(), nullable=True),
        sa.Column('alternative_roles',  postgresql.JSON(), nullable=True),
        sa.Column('role_courses',       postgresql.JSON(), nullable=True),
        sa.Column('gemini_response',    postgresql.JSON(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_resume_uploads_id'),      'resume_uploads', ['id'],      unique=False)
    op.create_index(op.f('ix_resume_uploads_user_id'), 'resume_uploads', ['user_id'], unique=False)


def downgrade() -> None:
    op.drop_table('resume_uploads')
    op.drop_table('user_predict_models')
    op.drop_table('chatbots')
    op.drop_table('profiles')
    op.drop_table('users')
