# Initialize a new Anchor project for a specific day
init number:
    anchor init day_{{number}} --no-git

# Build an existing day's Anchor project
build number:
    cd day_{{number}} && anchor build

test number:
    cd day_{{number}} && anchor test --skip-local-validator

# Initialize and build a day's project in one command
all number: (init number) (build number)
