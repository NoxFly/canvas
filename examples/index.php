<?php

$testDir = 'canvasScripts';


$tests = (object)array();

$dirs = array_filter(glob("$testDir/*"), 'is_dir');

foreach($dirs as $dir) {
    $reg = '/'.$testDir.'\/(\d+-.*)/';

    $dirname = preg_replace($reg, '$1', $dir);

    $name = str_replace('-', ' ', preg_replace('/\d+(.*)/', '$1', $dirname));

    $tests->{$dirname} = (object)array(
        "name" => $name,
        "files" => (object)array()
    );

    foreach(glob("$dir/*.js") as $filename) {
        $filename = str_replace($dir.'/', '', $filename);

        $reg = '/(\d+-.*)\.js/';

        $file = preg_replace($reg, '$1', $filename);
        $name = str_replace('-', ' ', preg_replace('/\d+-(.*)/', '$1', $file));

        $tests->{$dirname}->files->{$file} = $name;
    }
}

?>






<!DOCTYPE html>

<html>
    <head>
        <meta charset="utf-8">

        <link rel="stylesheet" type="text/css" href="style.css">

        <title>Canvas examples</title>
    </head>

    <body>

        <iframe></iframe>

        <section id='test-section'>
            <h1>Canvas examples</h1>

            <article id="list-tests-article">
                <ul id='list-dir'>
                    <?php

                        foreach($tests as $k => $test) {
                            echo "<li data-testDir='$k'>".$test->name."</li>";
                        }

                    ?>
                </ul>

                <div id='list-tests'>
                    <?php

                        foreach($tests as $k => $test) {
                            echo "<ul id='ul-$k'>";
                            echo "<h2>$test->name</h2>";
                            echo "<li class='back'>Back</li>";

                            foreach($test->files as $f => $file) {
                                echo "<li id='li-$f'>$file</li>";
                            }
                            
                            echo "</ul>";
                        }

                    ?>
                </div>
            </article>
        </section>

        <script src="script.js"></script>
    </body>
</html>