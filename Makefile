CC ?= gcc
CFLAGS ?= -Wall -Wextra -O3

# Resolve Cubiomes directory: environment variable > relative paths > fallback
ifeq ($(CUBIOMES_DIR),)
  ifneq ($(wildcard ../cubiomes),)
    CUBIOMES_DIR = ../cubiomes
  else ifneq ($(wildcard ../../Downloads/cubiomes),)
    CUBIOMES_DIR = ../../Downloads/cubiomes
  else
    CUBIOMES_DIR = /home/pc/Downloads/cubiomes
  endif
endif

CUBIOMES_DIR_ABS = $(abspath $(CUBIOMES_DIR))
CUBIOMES_BUILD ?= $(CUBIOMES_DIR_ABS)/build

INCLUDES = -Iengine/include -I$(CUBIOMES_DIR_ABS)

# Prefer static linking if libcubiomes_static.a exists, otherwise fallback to dynamic
ifneq ($(wildcard $(CUBIOMES_BUILD)/libcubiomes_static.a),)
  CUBIOMES_LIB = $(CUBIOMES_BUILD)/libcubiomes_static.a
  LDFLAGS = -Lengine -lseedlens $(CUBIOMES_LIB) -lm
else
  LDFLAGS = -Lengine -lseedlens -L$(CUBIOMES_BUILD) -lcubiomes -lm -Wl,-rpath,$(CUBIOMES_BUILD)
endif

TARGET = seedlens

all: $(TARGET)

engine/libseedlens.a:
	$(MAKE) -C engine CUBIOMES_DIR="$(CUBIOMES_DIR_ABS)"

$(TARGET): cli/main.c engine/libseedlens.a
	$(CC) $(CFLAGS) $(INCLUDES) cli/main.c -o $@ $(LDFLAGS)

test: $(TARGET)
	@bash tests/test_cli.sh

clean:
	$(MAKE) -C engine clean
	rm -f $(TARGET)

.PHONY: all clean test
