from setuptools import setup, find_packages


install_requires = [
    "jupyter",
    "ipykernel",
    "ipython",
    "notebook",
    "networkx==2.4",
    "jsonpath-rw>=1.4.0",
    "requests>=2.21.0",
    "graphviz>=0.11.1",
    "aiohttp",
    "pandas",
    "pyyaml",
    "nest-asyncio",
]

from os import path

this_directory = path.abspath(path.dirname(__file__))
with open(path.join(this_directory, "README.md"), encoding="utf-8") as f:
    long_description = f.read()

__version__ = "1.1.0"
setup(
    name="biothings_explorer",
    version=__version__,
    author="Jiwen Xin, Chunlei Wu",
    author_email="cwu@scripps.edu",
    description="Python Client for BioThings Explorer",
    long_description=long_description,
    long_description_content_type="text/markdown",
    license="BSD",
    keywords="schema biothings",
    url="https://github.com/biothings/biothings_explorer",
    packages=find_packages(),
    include_package_data=True,
    package_data={"": ["data/smartapi_local_specs.json"]},
    classifiers=[
        "Programming Language :: Python",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.4",
        "Programming Language :: Python :: 3.5",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "License :: OSI Approved :: BSD License",
        "Operating System :: POSIX",
        "Operating System :: MacOS :: MacOS X",
        "Operating System :: Microsoft :: Windows",
        "Operating System :: OS Independent",
        "Intended Audience :: Science/Research",
        "Intended Audience :: Developers",
        "Topic :: Utilities",
        "Topic :: Scientific/Engineering :: Bio-Informatics",
    ],
    install_requires=install_requires,
    dependency_links=["git+https://github.com/mmayers12/data_tools.git#egg=data_tools"],
    setup_requires=["pytest-runner"],
    tests_require=["pytest"],
)
