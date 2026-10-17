CC ?= gcc
AR ?= ar
CFLAGS ?= -Wall -Wextra -O3 -fPIC

ifeq ($(CUBIOMES_DIR),)
  ifneq ($(wildcard ../../cubiomes),)
    CUBIOMES_DIR = ../../cubiomes
  else ifneq ($(wildcard ../../../Downloads/cubiomes),)
    CUBIOMES_DIR = ../../../Downloads/cubiomes
  else
    CUBIOMES_DIR = /home/pc/Downloads/cubiomes
  endif
endif

CUBIOMES_DIR_ABS = $(abspath $(CUBIOMES_DIR))
INCLUDES = -Iinclude -I$(CUBIOMES_DIR_ABS)

SRCS = src/version.c \
       src/discovery.c \
       src/cluster.c \
       src/analysis.c \
       src/explanation.c \
       src/landmarks.c \
       src/engine.c \
       src/json.c

OBJS = $(SRCS:.c=.o)
LIB = libseedlens.a

all: $(LIB)

$(LIB): $(OBJS)
	$(AR) rcs $@ $^

src/%.o: src/%.c
	$(CC) $(CFLAGS) $(INCLUDES) -c $< -o $@

clean:
	rm -f src/*.o $(LIB)

.PHONY: all clean
