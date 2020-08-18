# Unix Basics

# Learning The Command Line

The command line is a simple text interface for interacting with your computer. At first, using a command line interface can be intimidating, but as you get more comfortable with it, you'll find that it becomes a powerful tool. This guide is aimed at beginners with the command line, to learn some basic uses.

## Command Line Navigation

To begin with, you'll need to get a command line prompt on your computer. The process for this varies from computer to computer, but the application you want may be called something like 'terminal', 'shell', or 'command line'. From here on, this tutorial will refer to the application as a terminal.

At any moment, a terminal has a location it is working from within your folders. This is called the working directory. Some commands you use may have different results depending on the working directory, so it can be useful to know what it is.

To determine what your working directory is, use the command `pwd`, which stands for 'print working directory'.

If you've just opened your terminal your working directory is most likely your user's home directory. However, you can also change to your home directory by typing `cd ~`. `cd` stands for change directory, and `~` is a shorthand to denote the home directory.

Try `pwd` again, and see if you get a different result.

Now that you've navigated to your home directory, you can make a new directory with, `mkdir liatrio_console_tutorial`.

Now navigate into the directory `cd liatrio_console_tutorial`

Tip: If you're typing out a long file or directory name, you can press the `<tab>` key to attempt to auto-complete it. If what you've typed is enough to identify the file, it will be filled in automatically. If you haven't typed enough to identify a single file, you can press `<tab>` twice to be shown a list of possibilities.

Commands:
```
pwd
cd ~
pwd
mkdir liatrio_console_tutorial
cd liatrio_console_tutorial
```

## Files

Next let's try making a file. The `touch` command updates the history of a file, without changing it. If the file doesn't exist, it will create it. Run the command `touch my_file`.

If we want to see that the file was created, you can use the `ls` command to list the files in a directory. Just type `ls`, you should see the file you just created.

Let's make another file `touch .my_hidden_file`. Try running `ls` again. This time your new file shouldn't show up. This is because the filename starts with `.`, denoting a hidden file. Hidden files aren't displayed by `ls` by default, however many commands like `ls` accept optional flags to slightly modify their behavior. To list all files, including hidden ones you can use the `-a` flag, which is used like `ls -a`. This time, your hidden file should display, along with some others that we'll discuss later.

If you're ever curious about what options are available for a command, you can read the command's manual. If you want to read the manual for `ls`, you can type `man ls`. Here you can read information about what a command does, and what options can be used with it. You can scroll on the page with the arrow keys, and when you are done reading, you can exit by pressing `q`.

Another useful command allows you to search a part of your system for files if you don't know where they're located. Run `find ~/ -name my_file`. `find` may have some directories that it can't access, but in the end it should be able to find your file.

Commands:
```
touch my_file
ls
touch .my_hidden_file
ls
ls -a
man ls
find ~/ -name my_file
```

## File Redirection

Now let's try displaying files. The `cat` command will concatenate and print files to the console. Try running `cat my_file`. You'll notice that nothing prints out, that's because the file doesn't actually have any content yet, it's just empty.

To generate something to put in the file, we'll use the `echo` command. Like you might expect `echo` simply repeats back exactly what you give it. Try running `echo "Hello World"`. You'll see that `echo` prints data to the screen, but we want it to go into our file. To accomplish this, we can use a file redirection operator. If we write, `> filename` after a command, the output will be printed to the file instead. Try running `echo "Hello World" > my_file`

Now we can test if we succeeded, by running `cat my_file`.
Let's say we want to add something to our file, try running `echo "File redirection is cool" > my_file`. If you `cat my_file` you'll see it didn't work. We overwrote our first message, instead of adding it to the end. If we want to add to the end of file, we instead should use the `>> filename` redirection. So let's try `echo "Second try" >> my_file`. Now you can `cat my_file` and see that it worked.

Commands:
```
cat my_file
echo "Hello World"
echo "Hello World" > my_file
cat my_file
echo "File redirection is cool" > my_file
cat my_file
echo "Second try" >> my_file
cat my_file
```

## Searching Files

For this next section let's talk about the `grep` command. `grep` can search a file for a pattern. This can be useful if know something is in a file, but the file is too large to search by hand. Try running `grep Second my_file`. Here 'Second' is the pattern we're searching for. Notice that `grep` prints out the whole line in the response giving some context for what was found.

Imagine that we'd like to search not just files, but also the output of other commands. As an example `touch find_me`. Imagine we want to find this file in a directory.  One way we can use `grep` to accomplish this is to `ls > temp_file` and then `grep find_me temp_file`. However, wanting to use the output of one command as the input for another is a fairly command situation. Instead of using a file as an in between, we can use the `|`, called a 'pipe'. A pipe is perfect for this situation and it does exactly what we need, passing the output of the first command, as input for the second. Run `ls | grep find_me`. Notice that the output is exactly the same, but this time we didn't require an extra file.

Commands:
```
grep Second my_file
touch find_me
ls > temp_file
grep find_me temp_file
ls | grep find_me
```

## Moving Files

For the final section, let's practice moving files around. First confirm that your working directory is `~/liatrio_console_tutorial`. Next we'll go into a new directory, with `mkdir test_directory` and `cd test_directory`.

The directory that our current working directory is inside of is called its 'parent directory'. So our current parent directory is `~/liatrio_console_tutorial`. Parent directories can also be referenced with a 'relative path'. A 'relative path' is one that changes depending on your current working directory. You can think of a 'relative path' as a series of steps that you'll need to take to get from the current directory to the one you're aiming for. The relative path for a parent directory is `../`, which you may have seen before when we listed all directories. (Also displayed was `./` which is the relative path for the current directory).

If we want to move a file from our parent directory to another directory, we can use the move, or `mv` command. `mv` expects two filenames to follow it, the current position of the file you want to move, and the location you want to move it to. To move `my_file` to the current directory the command we want is `mv ../my_file ./my_file`.

If you run `ls ../` you will see that the file isn't in the parent directory anymore, because it was moved. If you want the copy the file, so that it exists in both places, you can use the copy, or `cp` command, which is used in the same way as `mv`. try running `cp ../temp_file ./another_temp_file`. Noe, that here we gave our copy a different name. Because they're in different directories we could've used the same name, however two files in the same directory can't have the same name. If we want to rename the file we just copied, we can use the same `mv` command as before. The only difference is that the start and end directories are the same, for example `mv ./another_temp_file ./temp_file`.

Finally let's try removing files. The `rm` simply removes a file you specify, such as `rm temp_file`. Notice that you didn't have to use `./temp_file`, you could've, but using a filename without providing the directory will generally assume the current working directory.

If we want to remove a directory with `rm` we can do so, but everything inside the directory will also need to be removed. This can be specified with a simple option, like the one we used with `ls`. First run `cd ~` to move back to your home directory. Now run `rm -r liatrio_console_tutorial`. This removes the directory and everything inside it, so be sure you know what you're doing when you `rm -r`. Once this command completes you'll have cleaned up all the files we created and completed the Liatrio Console Tutorial.

Commands:
```
mkdir test_directory
cd test_directory
mv ../my_file ./my_file
ls ../
cp ../temp_file ./another_temp_file
mv ./another_temp_file ./temp_file
rm ./temp_file
cd ~
rm -r liatrio_console_tutorial
```

# Useful Unix / Linux Commands

| Command    | Example                   | Description                                                 |
|------------|---------------------------|-------------------------------------------------------------|
| `pwd`      | `pwd`                     | Print the name of the working directory                     |
| `cd`       | `cd path/to/directory/`   | Changes current working directory to given path             |
| `mkdir`    | `mkdir new_directory/`    | Creates a new directory with the given name                 |
| `touch`    | `touch new_file`          | Creates a new file / Updates timestamps of an existing file |
| `ls`       | `ls`                      | Prints the contents of the current directory                |
| `find`     | `find . -name "myfile"`   | Prints the location of a resource                           |
| `cat`      | `cat my_file`             | Prints the contents of a specified file                     |
| `echo`     | `echo 'Hello' `           | Prints the given arguments to the console                   |
| `which`    | `which java`              | Prints the path to the specified executable                 |
| `man`      | `man pwd`                 | Displays the manual pages for the specified arguments       |
| `rm`       | `rm my_file`              | Permanently deletes a resource                              |
| `cp`       | `cp my_file my_new_file`  | Copies the contents of an argument into a second argument   |
| `chmod`    | `chmod +x my_script.sh`   | Sets the permissions of files or directories                |
| `chown`    | `chown user:user my_file` | Change user or group ownership of a given argument          |
| `ctrl + r` | -----------------------   | Search through command line history                         |