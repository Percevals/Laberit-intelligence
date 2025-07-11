# Scripts Directory

This directory contains utility scripts for data analysis, migration, and maintenance tasks.

## Structure

```
scripts/
├── analysis/      # Data analysis and exploration scripts
├── migration/     # Framework migration tools (v3.0 → v4.0)
└── utils/         # General utility scripts
```

## Usage

### Analysis Scripts

Located in `analysis/`:

- `analyze_master_database.py` - Analyzes Excel database structure
- `analyze_masterdatabase_simple.py` - Simplified analysis without pandas

Example:
```bash
python scripts/analysis/analyze_master_database.py
```

### Migration Scripts

Located in `migration/`:

- `calculate_dii_migration.py` - Full DII v4.0 migration with pandas
- `calculate_dii_migration_demo.py` - Demo version without dependencies
- `create_mapping_matrix.py` - Business model mapping analysis
- `create_mapping_matrix_simple.py` - Simplified mapping without pandas

Example:
```bash
python scripts/migration/calculate_dii_migration_demo.py
```

### Dependencies

Some scripts require additional packages:
```bash
pip install pandas openpyxl
```

Scripts with `_simple` or `_demo` suffix work without external dependencies.

## Adding New Scripts

1. Choose appropriate subdirectory
2. Add clear docstring at top
3. Include example usage
4. Update this README

## Best Practices

- Use descriptive names
- Add `--help` argument support
- Handle errors gracefully
- Print progress for long operations
- Save outputs to `data/cache/` (gitignored)